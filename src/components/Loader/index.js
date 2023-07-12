import PropTypes from 'prop-types';

import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import { Overlay } from './styles';
import Spinner from '../Spinner';
import ReactPortal from '../ReactPortal';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';

export default function Loader({ isLoading }) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isLoading);

  if (!shouldRender) {
    return null;
  }

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <ReactPortal containerId="loader-root">
        <Overlay
          isLeaving={!isLoading}
          ref={animatedElementRef}
        >
          <Spinner size={90} />
        </Overlay>
      </ReactPortal>
    </StyleSheetManager>
  );
}

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
