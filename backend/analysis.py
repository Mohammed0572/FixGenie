def generate_analysis(issue_text: str, similar_issues: list) -> dict:
    text_lower = issue_text.lower()
    
    root_cause = "General unknown software behavior causing user workflow disruption."
    fix_steps = [
        "Inspect the application console logs for exact trace errors.",
        "Reproduce the bug in the local staging environment.",
        "Ensure the latest package dependencies are successfully installed."
    ]
    prevention = "Ensure adequate unit tests capture edge cases during CI/CD pipelines."

    if any(k in text_lower for k in ["crash", "error", "exception", "500", "fatal"]):
        root_cause = "Unhandled system exception or null pointer trace leading to immediate task termination."
        fix_steps = [
            "Check server application logs (stderr/stdout) for the exact trace.",
            "Identify the module throwing the exception.",
            "Add protective null/undefined checks around the failing variable."
        ]
        prevention = "Implement widespread try-catch bounding and fallback error boundaries on the UI."
    elif any(k in text_lower for k in ["login", "auth", "token", "password", "sign"]):
        root_cause = "Malformed authentication payload or invalidated JWT token configuration."
        fix_steps = [
            "Check if the frontend is appending the correct Authorization headers.",
            "Verify the JWT token expiration and signature locally.",
            "Inspect the network tab (Status 401/403) to see which gateway is rejecting it."
        ]
        prevention = "Integrate secure refresh-token cycling and rigorous schema validation on auth inputs."
    elif any(k in text_lower for k in ["db", "database", "sql", "query", "connection", "latency"]):
        root_cause = "Database timeout usually caused by exhausted connection pools or un-indexed sequential table scans."
        fix_steps = [
            "Run EXPLAIN ANALYZE on the slow queries causing the lock.",
            "Add missing B-tree indexes to frequent JOIN columns.",
            "Scale up the connection pool limit if exhaustion is actively spiking."
        ]
        prevention = "Implement a Redis caching layer for read-heavy operations."
    
    if similar_issues:
        prevention += f" (Note: We detected {len(similar_issues)} highly identical issues. Consolidate these tickets and resolve the root dependency bug!)"
        
    return {
        "root_cause": root_cause,
        "fix_steps": fix_steps,
        "prevention": prevention
    }

def generate_debug_steps(issue_text: str) -> list:
    text_lower = issue_text.lower()
    
    if any(k in text_lower for k in ["crash", "error", "exception", "500", "fatal"]):
        return [
            "Check server console logs for exact stack traces",
            "Identify the specific line number throwing the exception",
            "Verify the input payload wasn't null or undefined",
            "Add defensive try-catch boundaries around the failing module"
        ]
    elif any(k in text_lower for k in ["login", "auth", "token", "password", "sign"]):
        return [
            "Verify the JWT token wasn't expired or malformed",
            "Inspect the browser Network tab for 401/403 HTTP status",
            "Ensure the Authorization Bearer header is attached correctly",
            "Validate database credential hashing algorithms match"
        ]
    elif any(k in text_lower for k in ["db", "database", "sql", "query", "connection", "latency"]):
        return [
            "Run EXPLAIN ANALYZE on the slow endpoint query",
            "Check the cloud provider for active DB connection pool limits",
            "Verify table B-tree indexes exist for frequent JOIN columns",
            "Test the query execution time locally using staging data"
        ]
    else:
        return [
            "Reproduce the bug locally using the described steps",
            "Inspect the browser developer console for JavaScript warnings",
            "Check the React component state to ensure updates physically registered",
            "Verify frontend payload matches the exact API contract schema"
        ]

