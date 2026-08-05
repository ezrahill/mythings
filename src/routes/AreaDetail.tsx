import { useParams } from 'react-router-dom'
import { useAreaStore } from '../store/useAreaStore'

export function AreaDetail() {
  const { id } = useParams()
  const area = useAreaStore((state) => state.areas.find((a) => a.id === id))

  return (
    <div>
      <h1>{area?.name ?? 'Area'}</h1>
    </div>
  )
}
