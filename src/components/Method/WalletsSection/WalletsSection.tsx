import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { WalletTrio } from '../WalletTrio';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

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
    <MethodSection id={SECTION_NUMBER.wallets} title={wallets.title}>
      <WalletTrio pots={wallets.pots} />
      <MethodBlocks blocks={WALLET_BLOCKS} />
    </MethodSection>
  );
}
