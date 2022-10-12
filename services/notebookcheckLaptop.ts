import cheerio, { CheerioAPI, load } from 'cheerio'
import axios from 'axios'

const laptopParams = [
    'manufacturer', 'model', 'lang',
    'gpu', 'gpu_architecture',
    'gpu_class', 'cpu', 'cpu_generation',
    'cpu_cores', 'inch=14&inch_from',
    'inch_to', 'screen_ratio',
    'screen_resolution_x', 'screen_resolution_y',
    'screen_glossy', 'screen_panel_type',
    'screen_panel', 'screen_refresh_rate',
    'class', 'rating', 'reviewcount',
    'dr_workmanship', 'dr_display', 'dr_emissions',
    'dr_ergonomy', 'dr_performance', 'dr_mobility',
    'dr_temperature', 'dr_audio', 'age', 'min_age',
    'year_from', 'year_till', 'weight', 'size_width',
    'size_length', 'size_depth', 'price', 'min_price',
    'min_list_price', 'list_price', 'ram', 'battery_capacity',
    'battery_capacity_mah', 'hdd_size', 'hdd_type', 'odd_type',
    'lan_type', 'wlan_type', 'brightness_center', 'de2000_colorchecker',
    'percent_of_srgb', 'pwm', 'loudness_min', 'loudness_load',
    'battery_wlan', 'os_type', 'tag_type', 'nbcReviews', 'orderby',
    'scatterplot_x', 'scatterplot_y', 'scatterplot_r='
] as const

type LatopParamsType = {
    [index in typeof laptopParams[number]]? : string
}

export type LaptopEntry = {
    name: string,
    date: string,
    rating: number,
    title: string,
    link: string,
    cpu: string,
    gpu: string,
    screen_size: string,
    screen_res: string,
    wieght: number
}

export class LaptopParseError extends Error {}


export class NotebookcheckLaptop {
    private readonly notebookcheckUrl = "https://www.notebookcheck.net/Laptop-Search.8223.0.html"

    constructor(){
    }

    public async getDefaultLaptops(): Promise<Array<LaptopEntry>> {
        let lapEnt: LatopParamsType = {
            "rating": "70"
        }

        return this.getLaptops(lapEnt)
    }

    public async getLaptops(params: LatopParamsType): Promise<Array<LaptopEntry>> {
        // default params
        params["nbcReviews"] = "1" // only main revies
        params["orderby"]    = "1" // order by rating
        params["class"]      ="-1" // laptops only
        params["lang"]       = "2" // language

        const urlParams = new URLSearchParams(params)
        let specRegex = /((?:NVIDIA|Intel|AMD|Apple|Qualcomm).+?), (.+), (\d+[.]\d+") (\d+x\d+), (\d+(?:.\d+)?)/

        let res = await axios
            .get(
                this.notebookcheckUrl, {
                    params: urlParams
                }
            )
            .then( d => d.data as string)
            .catch(error => {
                throw new LaptopParseError()
            })
        
        let _cheerio: CheerioAPI  = load(res)
        let items = _cheerio("#search tr")
        let noItems = items.length

        let laptops: Array<LaptopEntry>  = [] 

        items.each((ind, elem) => {
            let ch = _cheerio(elem)
            if ((ch.hasClass("odd") || ch.hasClass("even")) && ch.attr("id")) {
                laptops.push({
                    name: ch.children("td").text(),
                    date: "",
                    rating: 0,
                    title: "",
                    link: "",
                    cpu: "",
                    gpu: "",
                    screen_size: "",
                    screen_res: "",
                    wieght: 0
                })
            }
            else if ((ch.hasClass("odd") || ch.hasClass("even"))) {
                let laptop = laptops.at(-1)!
                let lastTd = _cheerio(ch.children("td").get(2))
                let a = _cheerio(lastTd).children("a")
                let specs = _cheerio(lastTd).contents().last().text()
                laptop.date = ch.children("td").first().text()
                laptop.rating = Number(_cheerio(ch.children("td").get(1)).text().slice(0,-1))
                laptop.title =  a.text()
                laptop.link = a.attr("href")!
                let specmatch = specs.match(specRegex)

                if (specmatch != null) {
                    laptop.cpu = specmatch[1]
                    laptop.gpu = specmatch[2]
                    laptop.screen_size = specmatch[3]
                    laptop.screen_res = specmatch[4]
                    laptop.wieght = Number(specmatch[5])
                }
                else throw new LaptopParseError()
            }
            else {
            }
        })
        return laptops.slice(0,20)
    }
}

export default NotebookcheckLaptop;