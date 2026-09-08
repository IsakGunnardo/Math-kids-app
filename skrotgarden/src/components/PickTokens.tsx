import { Sprite } from './Sprite.tsx';

/** Raden med skruvar uppe till vänster: en skruv = en del att plocka. */
export function PickTokens({ count }: { count: number }) {
  const shown = Math.min(count, 10);
  return (
    <div className="tokens" aria-label={`${count} plock kvar`}>
      {Array.from({ length: shown }, (_, i) => (
        <Sprite key={`${count}-${i}`} sprite="ui/token" className="token" />
      ))}
      {count > shown && <span className="token-more">+{count - shown}</span>}
    </div>
  );
}
