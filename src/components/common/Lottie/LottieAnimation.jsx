import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import clsx from 'clsx';
import { LOTTIE_ASSETS } from '../../../constants/lottie';

const LottieAnimation = ({
  src = LOTTIE_ASSETS.loader,
  loop = true,
  autoplay = true,
  className,
  style,
}) => (
  <DotLottieReact
    src={src}
    loop={loop}
    autoplay={autoplay}
    className={clsx(className)}
    style={style}
  />
);

export default LottieAnimation;
