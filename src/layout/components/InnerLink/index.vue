<script>
import { request } from '@/api/work'
export default {
  data() {
    return {
      queryParams: null
    };
  },
  created() {
    const { meta: { routerParam } } = this.$route;
    if (routerParam && routerParam.includes('bpm=true')) {
      request.getBpmToken().then(res => {
        this.queryParams = routerParam + '&T=' + res.data.access_token
      })
    } else {
      this.queryParams = routerParam;
    }
  },
  render() {
    const { $route: { meta: { link } }, } = this;
    if ({ link }.link === "") {
      return "404";
    }
    let url = { link }.link;
    const height = document.documentElement.clientHeight - 94.5 + "px";
    const style = { height: height };
    return (
      <div style={style}>
        <iframe
          src={url + (this.queryParams ? `?${this.queryParams}` : '')}
          frameborder="no"
          style="width: 100%; height: 100%"
          scrolling="auto"
        ></iframe>
      </div>
    );
  },
};
</script>
