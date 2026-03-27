# Dummy training data extension for model
# This extends the data in model.py for more realistic training

EXTENDED_TRAINING_DATA = [
    ("navigation menu overlaps content on mobile", ["ui", "mobile", "bug"], "Medium"),
    ("search functionality returns no results", ["bug", "search"], "High"),
    ("profile page loads indefinitely", ["bug", "frontend", "performance"], "High"),
    ("email notifications not sending", ["bug", "backend", "integration"], "High"),
    ("dark mode toggle broken", ["bug", "ui", "theme"], "Medium"),
    ("file upload size limit too low", ["bug", "upload"], "Low"),
    ("table sorting not persisting", ["bug", "ui"], "Low"),
    ("keyboard navigation broken", ["accessibility", "bug"], "Medium"),
    ("charts not rendering in IE", ["bug", "browser", "compatibility"], "Low"),
    ("password reset link expires too quickly", ["bug", "auth"], "Medium"),
]

def get_all_training_data():
    """Combine base + extended data"""
    from .model import TRAINING_DATA
    return TRAINING_DATA + EXTENDED_TRAINING_DATA

