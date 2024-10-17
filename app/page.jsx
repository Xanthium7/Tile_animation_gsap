export default function Home() {
  return (
    <div className="relative w-screen h-screen">
      <div className="w-full h-full">
        <nav className="absolute top-0 left-0 w-screen flex justify-between items-center p-[2em] z-10 ">
          <a
            className="text-[#fff] font-extrabold uppercase text-3xl cursor-pointer"
            href="#"
          >
            EXPLORE
          </a>
          <button
            className="text-[#fff] bg-black rounded-md p-3 font-extrabold uppercase text-3xl cursor-pointer"
            id="flipButton"
          >
            SEE THROUGH
          </button>
        </nav>
        <section
          style={{ perspective: "1000px" }}
          className="board w-screen h-screen p-1 flex flex-col gap-1 bg-black relative z-[1]"
        ></section>

        <div className="fixed top-0 left-0 w-screen h-screen  overflow-hidden pointer-events-none z-[2] blocks-container">
          <div className="blocks"></div>
        </div>
      </div>
    </div>
  );
}
