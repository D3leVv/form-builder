import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/utils/utils";

export interface AnimatedBotIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface AnimatedBotIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const antennaVariants: Variants = {
	normal: { rotate: 0 },
	animate: {
		rotate: [0, -15, 15, -10, 10, 0],
		transition: {
			duration: 2,
			repeat: Infinity,
			repeatType: "loop",
			ease: "easeInOut",
		},
	},
};

const eyesVariants: Variants = {
	normal: { scaleY: 1 },
	animate: {
		scaleY: [1, 0.1, 1, 1, 0.1, 1],
		transition: {
			duration: 3,
			repeat: Infinity,
			repeatType: "loop",
			times: [0, 0.05, 0.1, 0.5, 0.55, 0.6],
		},
	},
};

const AnimatedBotIcon = forwardRef<AnimatedBotIconHandle, AnimatedBotIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		useEffect(() => {
			// Auto-start animation for "thinking" state if not controlled
			if (!isControlledRef.current) {
				controls.start("animate");
			}
		}, [controls]);

		return (
			<div
				className={cn("select-none", className)}
				role="img"
				aria-label="Thinking Bot"
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Animated Bot Icon</title>
					{/* Body */}
					<rect width="18" height="10" x="3" y="11" rx="2" />
					{/* Antenna */}
					<motion.g variants={antennaVariants} animate={controls} style={{ originX: "12px", originY: "11px" }}>
						<circle cx="12" cy="5" r="2" />
						<path d="M12 7v4" />
					</motion.g>
					{/* Eyes */}
					<motion.line x1="8" x2="8" y1="16" y2="16" variants={eyesVariants} animate={controls} />
					<motion.line x1="16" x2="16" y1="16" y2="16" variants={eyesVariants} animate={controls} />
				</svg>
			</div>
		);
	},
);

AnimatedBotIcon.displayName = "AnimatedBotIcon";

export { AnimatedBotIcon };
