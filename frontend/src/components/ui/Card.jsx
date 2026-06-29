import clsx from 'clsx';

export default function Card({ children, className, as: Component = 'div' }) {
  return (
    <Component className={clsx('rounded-[1.4rem] border border-white/80 bg-white p-5 shadow-card', className)}>
      {children}
    </Component>
  );
}
