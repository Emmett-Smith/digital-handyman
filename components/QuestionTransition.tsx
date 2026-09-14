'use client';
import {AnimatePresence,motion} from 'framer-motion';
export default function QuestionTransition({step,reduced,children}:{step:number;reduced:boolean;children:React.ReactNode}){return <AnimatePresence mode="wait"><motion.div key={step} initial={reduced?false:{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.12}}>{children}</motion.div></AnimatePresence>;}
