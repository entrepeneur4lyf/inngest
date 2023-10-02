import { FunctionRunStatus } from '../../store/generated';
import classNames from '../../utils/classnames';
import { FunctionRunStatusIcons } from './RunStatusIcons';

interface FuncCardProps {
  title: string;
  id: string;
  status?: FunctionRunStatus;
  active?: boolean;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export default function FuncCard({
  title,
  id,
  status,
  active = false,
  footer,
  onClick,
}: FuncCardProps) {
  return (
    <a
      className={classNames(
        active
          ? `outline outline-2 outline-indigo-400 outline-offset-3 bg-slate-900 border-slate-700/50`
          : null,
        `overflow-hidden bg-slate-800/50 w-full rounded-lg block`,
        onClick ? 'hover:bg-slate-800/80 cursor-pointer' : null,
      )}
      onClick={
        onClick
          ? (e) => {
              e.preventDefault();
              onClick();
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2 px-5 py-3.5">
        {status && <FunctionRunStatusIcons status={status} className="icon-lg" />}
        <h2 className="text-white">{title}</h2>
      </div>
      <hr className="border-slate-800/50" />
      <div className="text-3xs text-slate-500 leading-none px-5 py-3.5">Run ID: {id}</div>
      {footer}
    </a>
  );
}
