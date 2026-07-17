export default function SearchBar({value,onChange}){return <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Search recipes" className="rounded-xl border p-3"/>}
