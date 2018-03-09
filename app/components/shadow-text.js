import styled from 'styled-components/native'

export default styled.Text`
  opacity: ${({ isDisabled }) => isDisabled ? 0.5 : 1};
  /* TODO add isActive and see th ewhole logic behind it */
  /* for example when in front, we desable, otherwise we show active */
  shadow-color: ${({ isDisabled }) => isDisabled ? '#00000000' : '#000000'};
  shadow-opacity: 1;
  shadow-radius: 5;
`
