import styled, { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

export const SquareFrame = styled.div`
  padding-top: 100%;
  position: relative;
`

const skeletonLoading = keyframes`
  0%, 100% {
      background-position: 0 50%;
  }

  50% {
      background-position: 100% 50%;
  }
`

export const Skeleton = styled.div<{ height?: string; width?: string; borderRadius?: string }>`
  width: ${(p) => p.width ?? '50%'};
  height: ${(p) => p.height ?? '1.5rem'};
  background: linear-gradient(
    90deg,
    rgba(207, 216, 220, 0.3),
    rgba(207, 216, 220, 0.6),
    rgba(207, 216, 220, 0.3)
  );
  background-size: 600% 600%;
  animation: ${skeletonLoading} 3s ease infinite;
  border-radius: ${(p) => p.borderRadius ?? '4px'};
`
