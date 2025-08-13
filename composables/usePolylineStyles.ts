export const usePolylineStyles = () => {
  const createPolyline = (rideId, status) => {
    const styles = {
      recording: {
        strokeColor: '#ef4444',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      paused: {
        strokeColor: '#f59e0b',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'dashed'
      },
      completed: {
        strokeColor: '#10b981',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      cancelled: {
        strokeColor: '#6b7280',
        strokeWeight: 4,
        strokeOpacity: 0.6
      }
    }

    return {
      id: `polyline-${rideId}`,
      rideId,
      status,
      points: [],
      ...styles[status]
    }
  }

  const updatePolyline = (polyline) => {
    const styles = {
      recording: {
        strokeColor: '#ef4444',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      paused: {
        strokeColor: '#f59e0b',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        strokeStyle: 'dashed'
      },
      completed: {
        strokeColor: '#10b981',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      cancelled: {
        strokeColor: '#6b7280',
        strokeWeight: 4,
        strokeOpacity: 0.6
      }
    }

    Object.assign(polyline, styles[polyline.status])
  }

  const completePolyline = (polyline) => {
    polyline.status = 'completed'
    updatePolyline(polyline)
  }

  return {
    createPolyline,
    updatePolyline,
    completePolyline
  }
}