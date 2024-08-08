from math import radians, cos, sin, sqrt, atan2


def haversine(lon1, lat1, lon2, lat2):
    R = 3958.8  # Earth radius in miles
    dlon = radians(lon2 - lon1)
    dlat = radians(lat2 - lat1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance
