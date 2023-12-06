import { PiWarningCircleFill } from "react-icons/pi";

interface NoticeProps{
  noticeText: string;
    
  }

export function FailureNotice ({noticeText}: NoticeProps){
  return(
    <div className="justify-center menu mt-16 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative sm:w-1/4 my-6 mx-auto max-w-6xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col items-center w-full bg-red-300 px-3 py-5 outline-none focus:outline-none">
                    <div className="flex items-center text-base gap-1"><PiWarningCircleFill size={22}/>{noticeText}</div>
                      </div>
                      </div>
                    </div>)}
