export const onChangeWrapper = <T extends HTMLInputElement | HTMLTextAreaElement>(handler: (value: string) => void) => (
  event: React.ChangeEvent<T>
) => {
  event.preventDefault();
  handler(event.target.value);
};
