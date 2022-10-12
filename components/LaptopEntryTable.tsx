import { LaptopEntry } from "../services/notebookcheckLaptop"

interface LaptopEntryProps {
  laptops: Array<LaptopEntry>
}

export const LatopEntryTable: React.FC<LaptopEntryProps> = ({ laptops }: LaptopEntryProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>CPU</th>
          <th>GPU</th>
          <th>Rating</th>
          <th>Screen Resolution</th>
          <th>Screen Size</th>
          <th>Date Reviewed</th>
        </tr>
      </thead>
      <tbody>
      {
        laptops
          .map( each => 
            <tr key={each.name}>
              <td>
                <a href={each.link}>{each.name}</a>
              </td>
              <td>{each.cpu}</td>
              <td>{each.gpu}</td>
              <td>{each.rating}</td>
              <td>{each.screen_res}</td>
              <td>{each.screen_size}</td>
              <td>{each.date}</td>
            </tr>
          )
      }
      </tbody>
    </table>
  )
}