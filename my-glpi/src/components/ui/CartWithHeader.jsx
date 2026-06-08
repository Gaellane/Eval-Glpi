function CardWithHeader({props}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
      <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">{props.title}</h3>
      </div>
      <div className="px-6 py-4 text-slate-600">
        <p>{props.content}</p>
      </div>
    </div>
  )
}

export default CardWithHeader;  