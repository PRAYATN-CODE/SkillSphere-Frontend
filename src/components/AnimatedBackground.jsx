import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    const colors = [
        'from-zinc-100 to-zinc-50',
        'from-zinc-200 to-zinc-100',
        'from-zinc-300 to-zinc-200'
    ];

    return (
        <div className="fixed inset-0 overflow-hidden -z-10">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full bg-gradient-to-br ${colors[i % colors.length]} opacity-20`}
                    style={{
                        width: `${Math.random() * 200 + 100}px`,
                        height: `${Math.random() * 200 + 100}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: Math.random() * 30 + 30,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
};

export default AnimatedBackground;