import { useEffect, useState } from "react";

const ScheduleList = ({ schedule }) => {
  const [currentSchedule, setCurrentSchedule] = useState(schedule);

  useEffect(() => {
    setCurrentSchedule(schedule);
  }, [schedule]); // Update state when schedule prop changes

  if (!currentSchedule) return null;

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Winnipeg",
    timeZoneName: "short",
    hour12: false, // Use 24-hour format
  };

  const now = new Date();
  console.log(now);

  return (
    <div className="p-4 mt-36">
      <h2 className="text-xl font-bold mb-4">
        Schedule for {currentSchedule.stop.name}
      </h2>
      {currentSchedule["route-schedules"].map((routeSchedule, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Route {routeSchedule.route.number}: {routeSchedule.route.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-neutral-900">
              <thead>
                <tr className="bg-neutral-900">
                  <th className="border border-neutral-900 px-4 py-2">Route</th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Destination
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Scheduled Arrival
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    {" "}
                    Estimated Arrival
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Status
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Will Arrive in
                  </th>
                  {/* <th className="border border-neutral-900 px-4 py-2">Departure Scheduled</th>
                                    <th className="border border-neutral-900 px-4 py-2">Departure Estimated</th>
                                    <th className="border border-neutral-900 px-4 py-2">Departure Delay</th> */}
                </tr>
              </thead>
              <tbody>
                {routeSchedule["scheduled-stops"].map((stop, stopIndex) => {
                  const arrivalScheduled = stop.times.arrival.scheduled
                    ? new Date(stop.times.arrival.scheduled)
                    : null;
                  const arrivalEstimated = stop.times.arrival.estimated
                    ? new Date(stop.times.arrival.estimated)
                    : null;
                  const departureScheduled = stop.times.departure.scheduled
                    ? new Date(stop.times.departure.scheduled)
                    : null;
                  const departureEstimated = stop.times.departure.estimated
                    ? new Date(stop.times.departure.estimated)
                    : null;

                  console.log(now, "hello");
                  console.log(arrivalEstimated, "hello");
                  const arriveInTime =
                    arrivalEstimated && now
                      ? Math.round((now - arrivalEstimated) / (1000 * 60))
                      : null;

                  const arrivalDelay =
                    arrivalEstimated && arrivalScheduled
                      ? Math.round(
                          (arrivalEstimated - arrivalScheduled) / (1000 * 60)
                        )
                      : null;

                  const departureDelay =
                    departureEstimated && departureScheduled
                      ? Math.round(
                          (departureEstimated - departureScheduled) /
                            (1000 * 60)
                        )
                      : null;

                  return (
                    <tr
                      key={stopIndex}
                      className="border-t border-neutral-900 odd:bg-neutral-700 even:bg-neutral-800"
                    >
                      <td className="border border-neutral-900  px-4 py-2">
                        {routeSchedule.route?.number || "N/A"}
                      </td>
                      <td className="border border-neutral-900  px-4 py-2">
                        {stop.variant?.name || "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {arrivalScheduled
                          ? arrivalScheduled.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {arrivalEstimated
                          ? arrivalEstimated.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td
                        className={`border border-neutral-900 px-4 py-2 
                ${
                  stop.isLate
                    ? "text-red-500"
                    : stop.isEarly
                    ? "text-blue-500"
                    : "text-green-500"
                }
            `}
                      >
                        {arrivalDelay !== null
                          ? stop.isLate
                            ? `Delayed by ${arrivalDelay} mins`
                            : stop.isEarly
                            ? `Early by ${Math.abs(arrivalDelay)} mins`
                            : "On Time"
                          : "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {`${Math.abs(arriveInTime)} mins`}
                      </td>
                      {/* for departure data column */}
                      {/* <td className="border border-neutral-900 px-4 py-2">
                                                {departureScheduled ? departureScheduled.toLocaleTimeString() : "N/A"}
                                            </td>
                                            <td className="border border-neutral-900 px-4 py-2">
                                                {departureEstimated ? departureEstimated.toLocaleTimeString() : "N/A"}
                                            </td>
                                            <td
                                                className={`border border-neutral-900 px-4 py-2 ${
                                                    departureDelay > 0 ? "text-red-500" : "text-green-500"
                                                }`}
                                            >
                                                {departureDelay !== null
                                                    ? departureDelay > 0
                                                        ? `Delayed by ${departureDelay} mins`
                                                        : "On Time"
                                                    : "N/A"}
                                            </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
