import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";// Helper component to handle the rolling number count-up

 export default function Counter({ value }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => Math.round(latest).toLocaleString());
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier easeOut
      });
      return controls.stop;
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [rounded]);

  return <span ref={ref}>0</span>;
}