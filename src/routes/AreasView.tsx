import { Link } from 'react-router-dom'
import { useAreaStore } from '../store/useAreaStore'
import './View.css'

export function AreasView() {
  const areas = useAreaStore((state) => state.areas)

  return (
    <div className="view">
      <h1>Areas</h1>
      <ul className="card-grid">
        {areas.map((area) => (
          <li key={area.id}>
            <Link to={`/areas/${area.id}`} className="card">
              {area.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
