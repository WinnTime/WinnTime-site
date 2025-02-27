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
                        {routeSchedule["scheduled-stops"].map((stop, stopIndex) => (
                            <li key={stopIndex}>
                                <div>
                                    <h3>
                                        {stop.variant.key}
                                    </h3>
                                    <h3>
                                        {stop.variant.name}
                                    </h3>
                                </div>
                       
                                <div>
                                    Arrival Time Estimated: {new Date(stop.times.arrival.estimated).toLocaleTimeString()}
                                    Arrival Time Scheduled: {new Date(stop.times.arrival.scheduled).toLocaleTimeString()}
                                </div>
                                <div>
                                    Arrival Time Estimated: {new Date(stop.times.departure.estimated).toLocaleTimeString()}
                                    Arrival Time Scheduled: {new Date(stop.times.departure.scheduled).toLocaleTimeString()}
                                </div>
                            </li>
                            
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ScheduleList;
