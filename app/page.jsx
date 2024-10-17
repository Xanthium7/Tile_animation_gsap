"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState, useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const ROWS = 6;
  const COLS = 6;
  const BLOCK_SIZE = 50;
  const COOLDOWN = 1000;

  const [isFlipped, setIsFlipped] = useState(false);
  const boardRef = useRef(null);

  const createTiles = (row, col) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.innerHTML = `
    <div class="tile-face tile-front"></div>
    <div class="tile-face tile-back"></div>
    `;

    const bgPosition = `${col * 20}% ${row * 20}%`;
    tile.querySelector(".tile-front").style.backgroundPosition = bgPosition;
    tile.querySelector(".tile-back").style.backgroundPosition = bgPosition;

    return tile;
  };

  const createBoard = () => {
    if (boardRef.current) {
      boardRef.current.innerHTML = ""; // Clear existing content
      for (let i = 0; i < ROWS; i++) {
        const row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < COLS; j++) {
          row.appendChild(createTiles(i, j));
        }
        boardRef.current.appendChild(row);
      }
    }
  };

  const initializeTileAnimation = () => {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile, index) => {
      let lastEnterTime = 0;

      tile.addEventListener("mouseenter", () => {
        const currentTime = Date.now();
        if (currentTime - lastEnterTime > COOLDOWN) {
          lastEnterTime = currentTime;

          let tiltY;
          if (index % 6 === 0) {
            tiltY = -40;
          } else if (index % 6 === 5) {
            tiltY = 40;
          } else if (index % 6 === 1) {
            tiltY = -20;
          } else if (index % 6 === 4) {
            tiltY = 20;
          } else if (index % 6 === 2) {
            tiltY = -10;
          } else {
            tiltY = 10;
          }

          animateTile(tile, tiltY);
        }
      });
    });

    const flipButton = document.getElementById("flipButton");
    flipButton.addEventListener("click", () => flipAllTiles(tiles));
  };

  const animateTile = (tile, tilty) => {
    gsap
      .timeline()
      .set(tile, { rotateX: isFlipped ? 180 : 0, rotateY: 0 })
      .to(tile, {
        rotateX: isFlipped ? 450 : 270,
        rotateY: tilty,
        duration: 0.5,
        ease: "power2.Out",
      })
      .to(
        tile,
        {
          rotateX: isFlipped ? 540 : 360,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.In",
        },
        "-=0.25"
      );
  };

  const flipAllTiles = (tiles) => {
    setIsFlipped(!isFlipped);

    gsap.to(tiles, {
      rotateX: isFlipped ? 180 : 0,
      duration: 1,
      ease: "power2.inOut",
      stagger: {
        amount: 0.5,
        from: "random",
      },
    });
  };

  const createBlocks = () => {
    const blocksContainer = document.getElementById("blocks");
    if (blocksContainer) {
      blocksContainer.innerHTML = ""; // Clear existing blocks
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const numCols = Math.ceil(screenWidth / BLOCK_SIZE);
      const numRows = Math.ceil(screenHeight / BLOCK_SIZE);

      const numBlocks = numCols * numRows;

      for (let i = 0; i < numBlocks; i++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.dataset.index = i;
        blocksContainer.appendChild(block);
      }

      return { numCols, numBlocks };
    }
    return { numCols: 0, numBlocks: 0 };
  };

  const highlightBlock = (event) => {
    const { numCols } = window.blockInfo;
    const blocksContainer = document.getElementById("blocks");
    if (blocksContainer) {
      const rect = blocksContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cols = Math.floor(x / BLOCK_SIZE);
      const rows = Math.floor(y / BLOCK_SIZE);
      const index = cols + rows * numCols;

      const block = blocksContainer.children[index];
      if (block) {
        block.classList.add("highlight");
        setTimeout(() => {
          block.classList.remove("highlight");
        }, 250);
      }
    }
  };

  useEffect(() => {
    createBoard();
    initializeTileAnimation();
    window.blockInfo = createBlocks();
    document.addEventListener("mousemove", highlightBlock);

    return () => {
      document.removeEventListener("mousemove", highlightBlock);
    };
  }, []);

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
          ref={boardRef}
          style={{ perspective: "1000px" }}
          className="board w-screen h-screen p-1 flex flex-col gap-1 bg-black relative z-[1]"
        ></section>

        <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-[2] blocks-container">
          <div id="blocks" className="blocks"></div>
        </div>
      </div>
    </div>
  );
}
