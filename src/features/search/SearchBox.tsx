interface ISearchBoxProps
{
	value: string,
	onChange: (value: string) => void
};

export default function SearchBox({ value, onChange }: ISearchBoxProps)
{
	return (
		<input
			type = "text"
			value = {value}
			onChange = {e => onChange(e.target.value)}
			placeholder = "Search be meaning"
			aria-label = "Search notes"
			className = "w-full rounded-[10px] border border-gray-400 px-3 py-2 outline-none"
		/>
	);
}