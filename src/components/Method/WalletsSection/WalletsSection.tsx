import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { WalletTrio } from '../WalletTrio';
import { METHOD_COPY, type MethodBlock } from '../copy';
import { WALLETS_SECTION } from './constants';

const { wallets } = METHOD_COPY;

const WALLET_BLOCKS: readonly MethodBlock[] = [
  wallets.spending,
  wallets.savings,
  wallets.goodDeeds,
  wallets.goodDeedsConcrete,
  wallets.goodDeedsEvidence,
  wallets.goodDeedsTalk,
];

export function WalletsSection(): JSX.Element {
  return (
    <MethodSection number={WALLETS_SECTION.number} title={wallets.title}>
      <WalletTrio pots={wallets.pots} />
      <MethodBlocks blocks={WALLET_BLOCKS} />
    </MethodSection>
  );
}
