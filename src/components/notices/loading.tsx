import { FiLoader } from "react-icons/fi";

interface NoticeProps{
  noticeText: string;
}

export function LoadingNotice ({noticeText}: NoticeProps){
  return(
    <div className="justify-center menu mt-16 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative sm:w-1/4 my-6 mx-auto max-w-6xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col items-center w-full bg-neutral-700/50 p-6 outline-none focus:outline-none">
                    <div className="flex items-center text-xl text-white gap-2">{noticeText}<FiLoader/></div>
                      </div>
                      </div>
                    </div>)}