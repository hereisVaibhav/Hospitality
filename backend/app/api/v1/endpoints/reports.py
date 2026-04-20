from fastapi import APIRouter

router = APIRouter()


@router.get("/stats")
async def get_stats():
    return {
        "total_patients": 1248,
        "active_doctors": 45,
        "bed_occupancy": 82,
        "appointments_today": 156,
        "total_nurses": 68,
        "total_departments": 8,
        "revenue_this_month": 284500,
        "pending_admissions": 12,
        "discharged_today": 8,
        "emergency_cases": 5,
        "monthly_trends": {
            "patients": [980, 1020, 1100, 1050, 1180, 1248],
            "appointments": [120, 135, 142, 128, 150, 156],
            "months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
        }
    }
