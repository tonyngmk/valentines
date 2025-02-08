

"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const yesButtonRef = useRef(null);

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    sendTelegramMessage("No");
  };

  const moveButton = useCallback(() => {
    const containerWidth = 300;
    const containerHeight = 200;
    const newLeft = Math.random() * containerWidth;
    const newTop = Math.random() * containerHeight;
    setNoButtonStyle({ position: 'absolute', top: `${newTop}px`, left: `${newLeft}px` });
  }, []);

  const handleYesClick = () => {
    setYesPressed(true);
    sendTelegramMessage("Yes");
  };

  const sendTelegramMessage = (response) => {
    const message = response === "Yes" ? "Yes: Ok yay!!!" : `No: ${getNoButtonText()}`;
    
    const params = new URLSearchParams({
      chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
      text: message,
      parse_mode: "html"
    });
    
    axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_API}/sendMessage?${params}`)
      .then((response) => {
        console.log("Telegram API response:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message to Telegram:", error);
      });
  };

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "Have a heart!",
      "Don't be so cold!",
      "Change of heart?",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "Rawr!!! :((("
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-16">
      {yesPressed ? (
        <>
          <img src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" alt="Bear kisses" />
          <div className="text-4xl font-bold my-4">Ok yay!!!</div>
        </>
      ) : (
        <>
          <img className="h-[200px]" src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif" alt="Cute love bear" />
          <h1 className="text-2xl my-4">Will you be my Valentine?</h1>
          <div className="relative w-full">
            <div className="flex justify-center gap-4 relative">
              <button
                ref={yesButtonRef}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 ease-in-out`}
                style={{ transform: `scale(${1 + noCount * 0.5})` }}
                onClick={handleYesClick}
              >
                Yes
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 ease-in-out`}
                onClick={() => {
                  handleNoClick();
                  moveButton();
                }}
                style={noButtonStyle}
              >
                {getNoButtonText()}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
