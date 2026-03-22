from datetime import datetime

def format_date(dt: datetime) -> str:
    """Convert datetime to DD-MM-YYYY string."""
    return dt.strftime("%d-%m-%Y")

def parse_date(date_str: str) -> datetime:
    """Parse DD-MM-YYYY string to datetime."""
    return datetime.strptime(date_str, "%d-%m-%Y")