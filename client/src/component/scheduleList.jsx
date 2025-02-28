const ScheduleList = ({ schedule }) => {
    if (!schedule) return null; 

    console.log(schedule);

    return (
        <div>
            <h2>Schedule for {schedule.stop.name}</h2>
            
            {schedule["route-schedules"].map((routeSchedule, index) => (
                <div key={index}>
                    <h3>Route {routeSchedule.route.number}: {routeSchedule.route.name}</h3>
                    
                    <ul>
                        {routeSchedule["scheduled-stops"].map((stop, stopIndex) => {
                            const arrivalScheduled = stop.times.arrival.scheduled ? new Date(stop.times.arrival.scheduled) : null;
                            const arrivalEstimated = stop.times.arrival.estimated ? new Date(stop.times.arrival.estimated) : null;

                            const departureScheduled = stop.times.departure.scheduled ? new Date(stop.times.departure.scheduled) : null;
                            const departureEstimated = stop.times.departure.estimated ? new Date(stop.times.departure.estimated) : null;

                            // Calculate Delay in Minutes
                            const arrivalDelay = arrivalEstimated && arrivalScheduled
                                ? Math.round((arrivalEstimated - arrivalScheduled) / (1000 * 60))
                                : null;

                            const departureDelay = departureEstimated && departureScheduled
                                ? Math.round((departureEstimated - departureScheduled) / (1000 * 60))
                                : null;

                            return (
                                <li key={stopIndex}>
                                    <div>
                                        <h3>Variant: {stop.variant?.key || "N/A"} - {stop.variant?.name || "N/A"}</h3>
                                    </div>
                       
                                    <div>
                                        <strong>Arrival Scheduled:</strong> {arrivalScheduled ? arrivalScheduled.toLocaleTimeString() : "N/A"} <br />
                                        <strong>Arrival Estimated:</strong> {arrivalEstimated ? arrivalEstimated.toLocaleTimeString() : "N/A"} <br />
                                        {arrivalDelay !== null && (
                                            <strong style={{ color: arrivalDelay > 0 ? "red" : "green" }}>
                                                {arrivalDelay > 0 ? `Delayed by ${arrivalDelay} mins` : "On Time"}
                                            </strong>
                                        )}
                                    </div>

                                    <div>
                                        <strong>Departure Scheduled:</strong> {departureScheduled ? departureScheduled.toLocaleTimeString() : "N/A"} <br />
                                        <strong>Departure Estimated:</strong> {departureEstimated ? departureEstimated.toLocaleTimeString() : "N/A"} <br />
                                        {departureDelay !== null && (
                                            <strong style={{ color: departureDelay > 0 ? "red" : "green" }}>
                                                {departureDelay > 0 ? `Delayed by ${departureDelay} mins` : "On Time"}
                                            </strong>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;
