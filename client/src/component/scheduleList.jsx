import { useEffect, useState } from "react";

const ScheduleList = ({ schedule }) => {
  const [currentSchedule, setCurrentSchedule] = useState(schedule);

  useEffect(() => {
    setCurrentSchedule(schedule);
  }, [schedule]);

  if (!currentSchedule) return null;

  const now = new Date();
  console.log(schedule);

  const combinedStops = currentSchedule["route-schedules"]
    .flatMap((routeSchedule) =>
      routeSchedule["scheduled-stops"].map((stop) => {
        const arrivalEstimated = stop.times.arrival.estimated
          ? new Date(stop.times.arrival.estimated)
          : null;
        const arriveInTime = arrivalEstimated
          ? Math.round((arrivalEstimated - now) / (1000 * 60))
          : null;
        const formattedArriveInTime =
          arriveInTime !== null
            ? arriveInTime >= 60
              ? `${Math.floor(arriveInTime / 60)}h ${arriveInTime % 60}m`
              : `${arriveInTime} mins`
            : "N/A";

        return {
          routeNumber: routeSchedule.route?.number || "N/A",
          destination: stop.variant?.name || "N/A",
          arrivalScheduled: stop.times.arrival.scheduled
            ? new Date(stop.times.arrival.scheduled)
            : null,
          arrivalEstimated,
          cancelled: stop.cancelled,
          isLate: stop.isLate,
          isEarly: stop.isEarly,
          formattedArriveInTime,
        };
      })
    )
    .sort((a, b) =>
      a.arrivalEstimated && b.arrivalEstimated
        ? a.arrivalEstimated - b.arrivalEstimated
        : 0
    );

  return (
    <div className="p-4 mt-36">
      <h2 className="text-xl font-bold mb-4">
        Schedule for {currentSchedule.stop.name}
      </h2>

      {/* Combined Table */}
      <div className="overflow-x-auto mb-8">
        <h3 className="text-lg font-semibold mb-2">All Routes Combined</h3>
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
                Estimated Arrival
              </th>
              <th className="border border-neutral-900 px-4 py-2">Status</th>
              <th className="border border-neutral-900 px-4 py-2">
                Will Arrive In
              </th>
            </tr>
          </thead>
          <tbody>
            {combinedStops.map((stop, index) => {
              const arrivalDelay =
                stop.arrivalEstimated && stop.arrivalScheduled
                  ? Math.round(
                      (stop.arrivalEstimated - stop.arrivalScheduled) /
                        (1000 * 60)
                    )
                  : null;

              return (
                <tr
                  key={index}
                  className="border-t border-neutral-900 odd:bg-neutral-700 even:bg-neutral-800"
                >
                  <td className="border border-neutral-900 px-4 py-2">
                    {stop.routeNumber}
                  </td>
                  <td className="border border-neutral-900 px-4 py-2">
                    {stop.destination}
                  </td>
                  <td className="border border-neutral-900 px-4 py-2">
                    {stop.arrivalScheduled
                      ? stop.arrivalScheduled.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="border border-neutral-900 px-4 py-2">
                    {stop.arrivalEstimated
                      ? stop.arrivalEstimated.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td
                    className={`border border-neutral-900 px-4 py-2 ${
                      stop.cancelled === "true"
                        ? "text-gray-500"
                        : stop.isLate
                        ? "text-red-500"
                        : stop.isEarly
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {stop.cancelled === "true"
                      ? "Cancelled"
                      : arrivalDelay !== null
                      ? stop.isLate
                        ? `Delayed by ${arrivalDelay} mins`
                        : stop.isEarly
                        ? `Early by ${Math.abs(arrivalDelay)} mins`
                        : "On Time"
                      : "N/A"}
                  </td>
                  <td className="border border-neutral-900 px-4 py-2">
                    {stop.formattedArriveInTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Individual Route Tables */}
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
                    Estimated Arrival
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Status
                  </th>
                  <th className="border border-neutral-900 px-4 py-2">
                    Will Arrive In
                  </th>
                </tr>
              </thead>
              <tbody>
                {routeSchedule["scheduled-stops"].map((stop, stopIndex) => {
                  const arrivalEstimated = stop.times.arrival.estimated
                    ? new Date(stop.times.arrival.estimated)
                    : null;
                  const arriveInTime = arrivalEstimated
                    ? Math.round((arrivalEstimated - now) / (1000 * 60))
                    : null;
                  const formattedArriveInTime =
                    arriveInTime !== null
                      ? arriveInTime >= 60
                        ? `${Math.floor(arriveInTime / 60)}h ${
                            arriveInTime % 60
                          }m`
                        : `${arriveInTime} mins`
                      : "N/A";

                  return (
                    <tr
                      key={stopIndex}
                      className="border-t border-neutral-900 odd:bg-neutral-700 even:bg-neutral-800"
                    >
                      <td className="border border-neutral-900 px-4 py-2">
                        {routeSchedule.route?.number || "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {stop.variant?.name || "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {stop.times.arrival.scheduled
                          ? new Date(
                              stop.times.arrival.scheduled
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {stop.times.arrival.estimated
                          ? new Date(
                              stop.times.arrival.estimated
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {stop.cancelled === "true" ? "Cancelled" : "On Time"}
                      </td>
                      <td className="border border-neutral-900 px-4 py-2">
                        {formattedArriveInTime}
                      </td>
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
