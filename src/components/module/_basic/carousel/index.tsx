"use client";

import React, { ReactNode, useState } from "react";

import Carousel from "react-simply-carousel";

import styles from "./style.module.scss";

type Props = {
  children: ReactNode;
  itemsToShow?: number;
};

const AppCarousel: React.FC<Props> = ({ children, itemsToShow = 7 }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  return (
    <div>
      <Carousel
        containerProps={{ className: styles.container }}
        preventScrollOnSwipe
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        dotsNav={{
          show: false,
        }}
        responsiveProps={[{}]}
        itemsToShow={itemsToShow}
        speed={400}
      >
        {children}
      </Carousel>
    </div>
  );
};

export default AppCarousel;
