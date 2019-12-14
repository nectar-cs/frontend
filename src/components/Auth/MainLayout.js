import React from 'react';
import Layout from '../../assets/layouts';
import Text from '../../assets/text-combos';
import Utils from '../../utils/Utils';
import ModestLink from '../../widgets/ModestLink/ModestLink';
import S from './Styles';

const humanizeString = require('humanize-string');

export default function MainLayout({ children, errors, type }) {
  const image = Utils.image('nectar_mark_light.png');
  const Errors = () =>
    errors.map(e => (
      <li key={e}>
        <Text.P raw emotion="warn">
          {e}
        </Text.P>
      </li>
    ));

  return (
    <Layout.ThemePage>
      <S.Content>
        <S.TitleBox>
          <S.TitleLogo src={image} alt={'Nectar'} />
          <S.TitleText>mosaic</S.TitleText>
        </S.TitleBox>
        {children}
        <S.Options>
          <SwitchType type={type} />
          <ForgotPassword type={type} />
          <WhyRegister type={type} />
        </S.Options>
        <ul>
          <Errors />
        </ul>
      </S.Content>
    </Layout.ThemePage>
  );
}

function SwitchType({ type }) {
  const authTypes = ['login', 'register'];
  const opposite = authTypes[(authTypes.indexOf(type) + 1) % 2];

  return (
    <ModestLink to={`/auth/${opposite}`}>
      <Text.PA raw emotion="contrastFont">
        {humanizeString(opposite)} Page
      </Text.PA>
    </ModestLink>
  );
}

function ForgotPassword({ type }) {
  // eslint-disable-next-line no-alert
  const callback = () => alert('Password reset will be ready next week. Sorry.');
  if (type === 'login') {
    return (
      <Text.PA onClick={callback} low={1.4} emotion="contrastFont">
        Forgot Password
      </Text.PA>
    );
  }
  return <div />;
}

function WhyRegister({ type }) {
  if (type === 'register') {
    return (
      <Text.A low={1.4} href="https://github.com/nectar-cs/mosaic#backend">
        <Text.P emotion="contrastFont">Why am I registering?</Text.P>
      </Text.A>
    );
  }
  return <div />;
}
