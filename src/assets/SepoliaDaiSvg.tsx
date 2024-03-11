import sepoliaDaiSvg from './SVG/sepolia_dai.svg';
import { SVGProps } from './svgInterface';

export function SepoliaDaiSvg(props: SVGProps) {
  const { size } = props;
  return (
    <div className={`w-[${size ?? 44}px] h-[${size ?? 44}px]`}>
      <img src={sepoliaDaiSvg} />
    </div>
  );
}
