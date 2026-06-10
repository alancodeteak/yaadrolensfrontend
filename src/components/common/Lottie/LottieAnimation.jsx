import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from 'lottie-react';
import clsx from 'clsx';
import { LOTTIE_ASSETS } from '../../../constants/lottie';

const isJsonLottie = (src) => typeof src === 'string' && src.endsWith('.json');

const LottieAnimation = ({
  src = LOTTIE_ASSETS.loader,
  loop = true,
  autoplay = true,
  className,
  style,
}) => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    if (!isJsonLottie(src)) {
      setJsonData(null);
      return undefined;
    }

    let cancelled = false;

    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load Lottie JSON: ${src}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setJsonData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJsonData(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (isJsonLottie(src)) {
    if (!jsonData) {
      return <div className={clsx(className)} style={style} aria-hidden="true" />;
    }

    return (
      <Lottie
        animationData={jsonData}
        loop={loop}
        autoplay={autoplay}
        className={clsx(className)}
        style={style}
      />
    );
  }

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={clsx(className)}
      style={style}
    />
  );
};

export default LottieAnimation;
