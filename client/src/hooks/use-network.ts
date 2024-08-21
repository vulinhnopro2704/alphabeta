import { useEffect, useState } from "react";

//navigator.connection is a read-only property that returns a NetworkInformation object containing information about the system's connection, such as the current bandwidth of the user's device or whether the connection is metered. This property is useful for web developers who want to optimize the performance of their web applications based on the user's network connection.
//The NetworkInformation object contains the following properties:  
//downlink: Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per second.
//effectiveType: Returns the effective type of the connection meaning one of 'slow-2g', '2g', '3g', or '4g'.
//rtt: Returns the estimated effective round-trip time of the current connection in milliseconds.
//saveData: Returns a Boolean that is true if the user has requested a reduced data usage mode from the user agent.
//type: Returns the type of connection a device is using to communicate with the network. It can be one of the following values: 'bluetooth', 'cellular', 'ethernet', 'none', 'wifi', or 'wimax'.
const getConnection = () => {
    //@ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        return connection;
    } else {
        console.warn("Network Information API is not supported in this browser.");
        return null;
    }
}
// Check user's network connection is available or not
export const useNetwork = () => {
    const [connection, setConnection] = useState(getConnection());
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateStatus = () => {
            setConnection(getConnection());
            setIsOnline(!!getConnection().rtt);
        }

        connection.addEventListener('change', updateStatus);
        return () => connection.removeEventListener('change', updateStatus);
    }, [connection]);

    return [isOnline, connection]
}

//How to use this hook?
// useNetwork and use isOnline check the network connection status of the user.
// 'use client';
// import { useNetwork } from '@/hooks/use-network';

// export default function Home() {
//   const [isOnline, connection] = useNetwork();
//   return (
//       <main>
//         {//status of network connection}
//         <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
//         {// Type of network connection}
//         <span>Effective Type: {connection?.effectiveType}</span>
//         <span>Downlink: {connection?.downlink}</span>
//         <span>Latency: {connection?.rtt}</span>
//         <span>Save Data: {connection?.saveData ? 'On' : 'Off'}</span>
//       </main>
//   );
// }
