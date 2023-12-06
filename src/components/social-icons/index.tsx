import { ReactNode } from 'react'

interface SocialProps{
  url: string;
  children: ReactNode;
}
export function Social({url, children}: SocialProps){
  return(
    <a 
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className=" hover:text-sky-700 hover:scale-105 transition ease-in-out delay-150 duration-300 drop-shadow-lg"
    >
      {children}
    </a>
  )
}