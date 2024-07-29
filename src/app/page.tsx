"use client";
import { useEffect, useState, CSSProperties } from "react";
import Image from "next/image";
import Bell from "@/app/assets/Bell.png";
import NotificationDemo from "./components/Notification";
import swDev from "@/app/swDev";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [notificationKey, setNotificationKey] = useState<number>(0);

  useEffect(() => {
    swDev();
  }, []);

  const handleClick = () => {
    const newMessage = `This is notification #${notificationKey + 1}`;
    setMessage(newMessage);
    setNotificationKey(notificationKey + 1);

    // Send a message to the service worker to show a notification
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title: "New Notification",
        body: newMessage,
      });
    }
  };

  const createStyle = (i: number): CSSProperties =>
    ({
      "--i": i,
    } as CSSProperties);

  return (
    <main className="min-h-screen p-10 flex flex-col justify-center items-center gap-20">
      <NotificationDemo message={message} />
      <div className="text-center">
        <span className="text-gray-200 inline-flex flex-col h-[calc(theme(fontSize.base)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.lg)*theme(lineHeight.tight))] overflow-hidden">
          <ul className="block animate-text-slide-5 leading-tight [&_li]:block">
            <li>Hola!</li>
            <li>Hello!</li>
            <li>Namaste!</li>
            <li>Konnichiwa!</li>
            <li>Bonjour!</li>
            <li aria-hidden="true">Hola!</li>
          </ul>
        </span>
      </div>
      <div className="pulse relative w-40 h-40 bg-[#2F1A6199] rounded-full">
        <span style={createStyle(0)}></span>
        <span style={createStyle(1)}></span>
        <span style={createStyle(2)}></span>
        <span style={createStyle(3)}></span>
        <div className="rounded-full bg-[#2F1A6199] p-5 w-40 h-40 absolute cursor-pointer">
          <Image src={Bell} alt="Bell" className=""></Image>
        </div>
      </div>
      <div>
        <p className="text-gray-200 text-3xl font-bold text-center py-2">
          Lorem ipsum dolor sit amet.
        </p>
        <p className="text-gray-400 text-center py-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, ut.
        </p>
      </div>
      <button
        onClick={handleClick}
        className="bg-[#1D103A] text-white outline-none border-2 border-[#6434CE] px-5 py-3 rounded-xl w-96 font-semibold shadow-custom"
      >
        Send Notification
      </button>
    </main>
  );
}
