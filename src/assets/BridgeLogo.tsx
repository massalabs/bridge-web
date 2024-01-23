// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { ComponentPropsWithoutRef } from 'react';
import { BridgeMode } from '@/const';
import { useBridgeModeStore, useConfigStore } from '@/store/store';

export function BridgeLogo(props: ComponentPropsWithoutRef<'div'>) {
  const { ...rest } = props;

  const { theme } = useConfigStore();
  const { currentMode } = useBridgeModeStore();

  let textColor: string;
  let shapeColor: string;

  // TODO: check if this can be refactored using the color from the theme.
  if (currentMode === BridgeMode.mainnet) {
    if (theme === 'theme-dark') {
      textColor = '#fff';
      shapeColor = '#4AB2FF';
    } else {
      textColor = '#000';
      shapeColor = '#4AB2FF';
    }
  } else {
    if (theme === 'theme-dark') {
      textColor = '#fff';
      shapeColor = '#fff';
    } else {
      textColor = '#000';
      shapeColor = '#000';
    }
  }

  return (
    <div className="w-fit" data-testid="station-logo" {...rest}>
      <BridgeLogoSVG textColor={textColor} shapeColor={shapeColor} />
    </div>
  );
}

interface BridgeLogoProps {
  textColor: string;
  shapeColor: string;
}

/* eslint-disable max-len */
function BridgeLogoSVG(props: BridgeLogoProps) {
  const { textColor, shapeColor } = props;

  return (
    // prettier-ignore
    <svg width="239" height="33" viewBox="0 0 239 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.6709 24.8806V10.0734H42.548V12.5033C42.8062 11.6788 43.3177 11.0192 44.0826 10.5245C44.8475 10.0298 45.7511 9.78241 46.7885 9.78241C47.9789 9.78241 48.9111 10.0249 49.5852 10.5051C50.264 10.9852 50.7947 11.8 51.1867 12.9446C51.55 11.9989 52.1715 11.2374 53.0416 10.6554C53.9165 10.0734 55.0017 9.78241 56.3068 9.78241C58.133 9.78241 59.4525 10.3499 60.2604 11.4896C61.0683 12.6294 61.4699 14.487 61.4699 17.0672V24.8806H57.5928V17.4212C57.5928 15.8547 57.3824 14.7392 56.957 14.0844C56.5315 13.4248 55.8239 13.0998 54.8248 13.0998C53.8256 13.0998 53.0798 13.4297 52.6352 14.0844C52.1906 14.744 51.9707 15.811 51.9707 17.2951V24.8806H48.0936V17.4455C48.0936 15.845 47.8928 14.7246 47.496 14.0796C47.0992 13.4394 46.4012 13.1192 45.4164 13.1192C44.4316 13.1192 43.6715 13.4685 43.2221 14.1669C42.7727 14.8653 42.548 16.0002 42.548 17.5667V24.8758H38.6709V24.8806Z" fill={textColor}/>
      <path d="M70.4672 25.2203C69.5541 25.2203 68.7031 25.0457 67.9191 24.7013C67.1351 24.357 66.4514 23.8623 65.8682 23.2172C65.285 22.5722 64.826 21.7573 64.4914 20.7679C64.1567 19.7834 63.9846 18.6824 63.9846 17.465C63.9846 16.2477 64.1519 15.1516 64.4818 14.1719C64.8165 13.1921 65.2706 12.3822 65.8539 11.7517C66.4371 11.1212 67.116 10.6313 67.9 10.2918C68.684 9.95231 69.5302 9.77771 70.4433 9.77771C71.4903 9.77771 72.4416 10.0251 73.2926 10.5246C74.1435 11.0242 74.7507 11.7032 75.1188 12.5713V10.0687H78.9959V24.8517H75.1188V22.4364C74.7698 23.2803 74.1674 23.9544 73.3069 24.4588C72.4464 24.9632 71.4998 25.2154 70.472 25.2154L70.4672 25.2203ZM71.562 21.9319C72.652 21.9319 73.5364 21.5294 74.2153 20.7291C74.8941 19.9289 75.2383 18.8425 75.2383 17.465C75.2383 16.0876 74.8989 15.0206 74.2153 14.2301C73.5316 13.4395 72.6424 13.0418 71.5333 13.0418C70.4242 13.0418 69.5493 13.4347 68.8705 14.2252C68.1916 15.0158 67.857 16.0925 67.857 17.4699C67.857 18.8473 68.1964 19.9434 68.88 20.7388C69.5589 21.5342 70.4529 21.9319 71.562 21.9319Z" fill={textColor}/>
      <path d="M88.256 25.133C86.468 25.133 84.9525 24.7644 83.7144 24.032C82.4762 23.2996 81.673 22.3199 81.3145 21.0977L84.8426 20.5012C85.1103 21.0832 85.5406 21.5342 86.1381 21.8543C86.7357 22.1744 87.4528 22.3345 88.2799 22.3345C89.1069 22.3345 89.8145 22.189 90.2925 21.9028C90.7706 21.6167 91.0097 21.2141 91.0097 20.7C91.0097 20.3896 90.9045 20.1229 90.6893 19.9046C90.479 19.6864 90.1969 19.5118 89.8432 19.3808C89.4894 19.2498 89.083 19.1383 88.6193 19.0413C88.1604 18.9443 87.6727 18.8473 87.166 18.7454C86.6592 18.6436 86.1525 18.532 85.6457 18.4059C85.139 18.2798 84.6561 18.1052 84.1972 17.887C83.7383 17.6687 83.3367 17.4068 82.9829 17.1013C82.6291 16.7957 82.3471 16.4029 82.1415 15.913C81.9359 15.4232 81.8355 14.8654 81.8403 14.23C81.8642 12.906 82.4618 11.839 83.6283 11.0242C84.7948 10.2093 86.2959 9.80194 88.1221 9.80194C89.6615 9.80194 91.0288 10.1414 92.2287 10.8205C93.4287 11.4995 94.2031 12.4016 94.5521 13.5316L91.0861 14.1524C90.871 13.6529 90.5029 13.2649 89.9818 12.9787C89.4607 12.6926 88.8727 12.5471 88.2177 12.5471C87.4098 12.5471 86.7835 12.6829 86.3342 12.9593C85.8848 13.2358 85.6601 13.6141 85.6601 14.1039C85.6601 14.4143 85.7653 14.6811 85.9804 14.8945C86.1955 15.1079 86.4776 15.2777 86.8361 15.3989C87.1947 15.5202 87.601 15.6269 88.0648 15.7093C88.5237 15.7918 89.0113 15.8791 89.5229 15.9664C90.0344 16.0537 90.5459 16.1555 91.0575 16.2719C91.569 16.3835 92.0566 16.5484 92.5156 16.7521C92.9745 16.9606 93.3856 17.208 93.7442 17.5038C94.1027 17.7997 94.3848 18.1877 94.5999 18.6727C94.8103 19.1577 94.9202 19.7155 94.9202 20.346C94.9202 21.8204 94.3179 22.9892 93.1179 23.8428C91.918 24.6965 90.2926 25.1281 88.2512 25.1281L88.256 25.133Z" fill={textColor}/>
      <path d="M103.162 25.133C101.374 25.133 99.8588 24.7644 98.6206 24.032C97.3824 23.2996 96.5793 22.3199 96.2207 21.0977L99.7488 20.5012C100.017 21.0832 100.447 21.5342 101.044 21.8543C101.642 22.1744 102.359 22.3345 103.186 22.3345C104.013 22.3345 104.721 22.189 105.199 21.9028C105.677 21.6167 105.916 21.2141 105.916 20.7C105.916 20.3896 105.811 20.1229 105.596 19.9046C105.385 19.6864 105.103 19.5118 104.749 19.3808C104.396 19.2498 103.989 19.1383 103.526 19.0413C103.067 18.9443 102.579 18.8473 102.072 18.7454C101.565 18.6436 101.059 18.532 100.552 18.4059C100.045 18.2798 99.5624 18.1052 99.1034 17.887C98.6445 17.6687 98.2429 17.4068 97.8892 17.1013C97.5354 16.7957 97.2533 16.4029 97.0478 15.913C96.8422 15.4232 96.7418 14.8654 96.7466 14.23C96.7705 12.906 97.3681 11.839 98.5345 11.0242C99.701 10.2093 101.202 9.80194 103.028 9.80194C104.568 9.80194 105.935 10.1414 107.135 10.8205C108.335 11.4995 109.109 12.4016 109.458 13.5316L105.992 14.1524C105.777 13.6529 105.409 13.2649 104.888 12.9787C104.367 12.6926 103.779 12.5471 103.124 12.5471C102.316 12.5471 101.69 12.6829 101.24 12.9593C100.791 13.2358 100.566 13.6141 100.566 14.1039C100.566 14.4143 100.672 14.6811 100.887 14.8945C101.102 15.1079 101.384 15.2777 101.742 15.3989C102.101 15.5202 102.507 15.6269 102.971 15.7093C103.43 15.7918 103.918 15.8791 104.429 15.9664C104.941 16.0537 105.452 16.1555 105.964 16.2719C106.475 16.3835 106.963 16.5484 107.422 16.7521C107.881 16.9606 108.292 17.208 108.65 17.5038C109.009 17.7997 109.291 18.1877 109.506 18.6727C109.717 19.1577 109.826 19.7155 109.826 20.346C109.826 21.8204 109.224 22.9892 108.024 23.8428C106.824 24.6965 105.199 25.1281 103.157 25.1281L103.162 25.133Z" fill={textColor}/>
      <path d="M118.121 25.2203C117.208 25.2203 116.357 25.0457 115.573 24.7013C114.789 24.357 114.105 23.8623 113.522 23.2172C112.939 22.5722 112.48 21.7573 112.145 20.7679C111.81 19.7834 111.638 18.6824 111.638 17.465C111.638 16.2477 111.806 15.1516 112.135 14.1719C112.47 13.1921 112.924 12.3822 113.507 11.7517C114.091 11.1212 114.77 10.6313 115.554 10.2918C116.338 9.95231 117.184 9.77771 118.097 9.77771C119.144 9.77771 120.095 10.0251 120.946 10.5246C121.797 11.0242 122.404 11.7032 122.772 12.5713V10.0687H126.649V24.8517H122.772V22.4364C122.423 23.2803 121.821 23.9544 120.96 24.4588C120.1 24.9632 119.153 25.2154 118.126 25.2154L118.121 25.2203ZM119.216 21.9319C120.306 21.9319 121.19 21.5294 121.869 20.7291C122.548 19.9289 122.892 18.8425 122.892 17.465C122.892 16.0876 122.552 15.0206 121.869 14.2301C121.185 13.4395 120.296 13.0418 119.187 13.0418C118.078 13.0418 117.203 13.4347 116.524 14.2252C115.845 15.0158 115.511 16.0925 115.511 17.4699C115.511 18.8473 115.85 19.9434 116.534 20.7388C117.212 21.5342 118.106 21.9319 119.216 21.9319Z" fill={textColor}/>
      <path d="M162.026 25.2203C160.979 25.2203 160.028 24.9681 159.168 24.4637C158.307 23.9593 157.705 23.2851 157.356 22.4412V24.8565H153.479V5.25262H157.356V12.5471C157.705 11.6935 158.307 11.0193 159.158 10.5246C160.009 10.0251 160.96 9.77773 162.007 9.77773C162.92 9.77773 163.767 9.94748 164.551 10.2918C165.33 10.6313 166.018 11.1212 166.606 11.7517C167.194 12.3822 167.658 13.1922 167.988 14.1719C168.318 15.1564 168.485 16.2525 168.485 17.4651C168.485 18.6776 168.318 19.7785 167.988 20.7679C167.653 21.7525 167.194 22.5722 166.611 23.2172C166.028 23.8623 165.339 24.357 164.56 24.7013C163.781 25.0457 162.935 25.2203 162.031 25.2203H162.026ZM160.932 21.932C162.026 21.932 162.916 21.5294 163.594 20.7291C164.273 19.9289 164.608 18.8425 164.608 17.4651C164.608 16.0876 164.268 15.0206 163.594 14.2301C162.916 13.4395 162.022 13.0418 160.908 13.0418C159.794 13.0418 158.924 13.4347 158.245 14.2252C157.566 15.0158 157.231 16.0925 157.231 17.4699C157.231 18.8473 157.571 19.9434 158.254 20.7388C158.938 21.5343 159.827 21.932 160.936 21.932H160.932Z" fill={textColor}/>
      <path d="M171.234 24.8808V10.0736H175.111V12.2997C175.245 11.936 175.441 11.6013 175.699 11.2861C175.957 10.9757 176.282 10.6944 176.67 10.447C177.062 10.1997 177.544 10.0202 178.128 9.9135C178.711 9.8068 179.351 9.7971 180.049 9.87955L179.662 13.6092C178.19 13.3328 177.066 13.5462 176.282 14.2591C175.503 14.9721 175.111 16.1798 175.111 17.8821V24.8759H171.234V24.8808Z" fill={textColor}/>
      <path d="M183.874 8.14809C183.224 8.14809 182.693 7.96864 182.277 7.60974C181.861 7.25083 181.656 6.76583 181.656 6.14987C181.656 5.53391 181.861 5.03921 182.272 4.69C182.684 4.3408 183.219 4.1662 183.874 4.1662C184.529 4.1662 185.031 4.3408 185.456 4.69C185.882 5.03921 186.092 5.52906 186.092 6.14987C186.092 6.77068 185.877 7.24113 185.452 7.60489C185.026 7.96864 184.5 8.14809 183.874 8.14809ZM181.928 24.8808V10.0736H185.781V24.8808H181.928Z" fill={textColor}/>
      <path d="M195.07 25.2203C194.157 25.2203 193.306 25.0457 192.522 24.7013C191.738 24.357 191.054 23.8623 190.471 23.2172C189.888 22.5721 189.429 21.7573 189.094 20.7679C188.76 19.7834 188.588 18.6824 188.588 17.465C188.588 16.2477 188.755 15.1516 189.085 14.1718C189.419 13.1921 189.874 12.3822 190.457 11.7517C191.04 11.1212 191.719 10.6313 192.503 10.2918C193.287 9.95229 194.133 9.77769 195.046 9.77769C196.103 9.77769 197.059 10.0299 197.915 10.5295C198.77 11.029 199.373 11.7129 199.722 12.5713V5.24774H203.599V24.8468H199.722V22.4315C199.373 23.2754 198.77 23.9496 197.91 24.454C197.049 24.9584 196.103 25.2106 195.075 25.2106L195.07 25.2203ZM196.165 21.9319C197.26 21.9319 198.149 21.5294 198.828 20.7291C199.507 19.9289 199.841 18.8424 199.841 17.465C199.841 16.0876 199.502 15.0206 198.818 14.23C198.135 13.4395 197.245 13.0418 196.136 13.0418C195.027 13.0418 194.152 13.4346 193.473 14.2252C192.795 15.0158 192.46 16.0925 192.46 17.4699C192.46 18.8473 192.799 19.9434 193.483 20.7388C194.162 21.5342 195.056 21.9319 196.165 21.9319Z" fill={textColor}/>
      <path d="M213.901 30.1674C212.056 30.1674 210.517 29.7939 209.283 29.047C208.05 28.3001 207.199 27.2428 206.735 25.8654L210.435 25.0069C210.694 25.6811 211.133 26.2146 211.75 26.6123C212.367 27.01 213.093 27.2088 213.925 27.2088C215.13 27.2088 216.038 26.8693 216.641 26.1952C217.243 25.521 217.549 24.4492 217.549 22.9844V21.5925C217.21 22.4364 216.617 23.0766 215.78 23.5082C214.939 23.9447 213.983 24.1581 212.902 24.1581C211.98 24.1581 211.129 23.9981 210.345 23.6828C209.561 23.3676 208.882 22.9117 208.294 22.3248C207.706 21.738 207.247 20.9814 206.917 20.0599C206.582 19.1432 206.42 18.1101 206.42 16.9752C206.42 15.8403 206.582 14.8218 206.912 13.91C207.242 12.9933 207.696 12.2416 208.275 11.6547C208.858 11.063 209.537 10.6119 210.321 10.3015C211.105 9.99114 211.956 9.83594 212.874 9.83594C213.964 9.83594 214.929 10.0542 215.771 10.4955C216.612 10.932 217.205 11.5868 217.544 12.455V10.0784H221.421V22.2715C221.421 25.0215 220.805 27.0245 219.571 28.2855C218.338 29.5466 216.445 30.1771 213.892 30.1771L213.901 30.1674ZM211.296 20.1375C211.98 20.8941 212.869 21.2772 213.978 21.2772C215.087 21.2772 215.971 20.8941 216.646 20.1326C217.32 19.3711 217.654 18.3187 217.654 16.9752C217.654 15.6318 217.315 14.6181 216.641 13.8518C215.962 13.0855 215.068 12.7023 213.954 12.7023C212.84 12.7023 211.98 13.0855 211.301 13.8518C210.622 14.6181 210.278 15.6609 210.278 16.9752C210.278 18.2896 210.617 19.376 211.301 20.1375H211.296Z" fill={textColor}/>
      <path d="M231.867 25.1718C229.572 25.1718 227.732 24.4685 226.345 23.0669C224.959 21.6652 224.266 19.7979 224.266 17.4699C224.266 15.1419 224.959 13.3425 226.345 11.9166C227.732 10.4907 229.534 9.77771 231.743 9.77771C234.152 9.77771 236.012 10.5634 237.327 12.13C238.641 13.6966 239.182 15.7821 238.947 18.3769H228.138C228.172 19.5748 228.53 20.506 229.209 21.1802C229.888 21.8495 230.811 22.1842 231.977 22.1842C233.631 22.1842 234.726 21.573 235.266 20.3508L238.809 20.7825C238.288 22.223 237.437 23.3142 236.265 24.0563C235.094 24.7983 233.626 25.1669 231.867 25.1669V25.1718ZM228.229 15.7869H235.395C235.319 14.7927 234.965 14.0021 234.334 13.4201C233.703 12.8381 232.871 12.5471 231.843 12.5471C230.815 12.5471 230.003 12.8284 229.357 13.3862C228.712 13.9488 228.339 14.7442 228.229 15.7821V15.7869Z" fill={textColor}/>

      <path d="M0 0L7.59648 13.3279L15.2121 0.0388004L0 0Z" fill={shapeColor}/>
      <path d="M15.1833 0L22.7798 13.3279L30.3954 0.0388004L15.1833 0Z" fill={shapeColor}/>
      <path d="M131.641 10.1851L139.878 24.6334L148.134 10.2288L131.641 10.1851Z" fill={shapeColor}/>
      <path d="M2.01275 28.4359C2.01275 21.0444 7.91209 15.0594 15.1978 15.0594C22.4836 15.0594 28.3829 21.0541 28.3829 28.4359V32.0928H30.3573V13.0515H0.0383301V32.088H2.01275V28.431V28.4359Z" fill={shapeColor}/>
    </svg>
  );
}
