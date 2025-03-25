import { ReactNode } from "react";
import { Footer } from "./footer";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col bg-blue-600 justify-center items-center size-full">
      <h1 className="text-white text-3xl pb-4">My Todos</h1>
      <div className="bg-white rounded-lg h-128 min-w-96 p-8 grid grid-rows-[minmax(0,1fr)_auto]">
        <div className="overflow-auto flex flex-col">{children}</div>
        <Footer />
      </div>
    </div>
  );
};
