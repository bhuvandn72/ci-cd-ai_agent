import os
import subprocess
import uuid


def _has_pytest_targets(path):
    if os.path.isdir(os.path.join(path, "tests")):
        return True
    for root, _, files in os.walk(path):
        for name in files:
            if name.startswith("test_") and name.endswith(".py"):
                return True
    return False


def _select_test_root(repo_path):
    candidates = [repo_path, os.path.join(repo_path, "backend")]
    valid = [p for p in candidates if os.path.isdir(p)]
    ranked = []
    for path in valid:
        has_requirements = os.path.exists(os.path.join(path, "requirements.txt"))
        has_tests = _has_pytest_targets(path)
        score = int(has_tests) * 3 + int(has_requirements)
        ranked.append((score, path))
    if not ranked:
        return repo_path
    ranked.sort(key=lambda item: item[0], reverse=True)
    return ranked[0][1]


def create_test_dockerfile(repo_path):
    dockerfile_content = """
FROM python:3.10
WORKDIR /app
COPY . .
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
CMD ["pytest"]
"""
    dockerfile_path = os.path.join(repo_path, ".agent.test.Dockerfile")
    with open(dockerfile_path, "w", encoding="utf-8") as f:
        f.write(dockerfile_content)
    return dockerfile_path


def _docker_available():
    probe = subprocess.run(
        ["docker", "info"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    return probe.returncode == 0, probe.stdout, probe.stderr


def run_tests_in_docker(repo_path, allow_fallback=True, forced_root=None):
    image_name = f"test-runner-{uuid.uuid4().hex[:6]}"
    available, _, probe_stderr = _docker_available()
    if not available:
        return {
            "status": "docker_unavailable",
            "stdout": "",
            "stderr": probe_stderr,
            "exit_code": 1,
        }

    test_root = forced_root or _select_test_root(repo_path)
    dockerfile_path = create_test_dockerfile(test_root)
    try:
        build_process = subprocess.run(
            ["docker", "build", "-f", dockerfile_path, "-t", image_name, test_root],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )

        if build_process.returncode != 0:
            return {
                "status": "build_failed",
                "stdout": build_process.stdout,
                "stderr": build_process.stderr,
                "exit_code": build_process.returncode,
                "test_root": test_root,
            }

        run_process = subprocess.run(
            ["docker", "run", "--rm", image_name],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )

        stdout = run_process.stdout
        stderr = run_process.stderr

        if run_process.returncode == 0:
            return {
                "status": "success",
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": 0,
                "test_root": test_root,
            }

        if run_process.returncode == 5 or "no tests ran" in stdout.lower():
            if (
                allow_fallback
                and os.path.normpath(test_root) != os.path.normpath(repo_path)
            ):
                return run_tests_in_docker(
                    repo_path,
                    allow_fallback=False,
                    forced_root=repo_path,
                )
            return {
                "status": "no_tests",
                "exit_code": run_process.returncode,
                "stdout": stdout,
                "stderr": stderr,
                "test_root": test_root,
            }

        return {
            "status": "failed",
            "exit_code": run_process.returncode,
            "stdout": stdout,
            "stderr": stderr,
            "test_root": test_root,
        }
    finally:
        if os.path.exists(dockerfile_path):
            os.remove(dockerfile_path)
