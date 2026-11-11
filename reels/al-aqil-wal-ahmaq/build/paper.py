# Generates a warm, slightly aged paper texture (1080x1920) with faint ruled lines.
import numpy as np
from PIL import Image, ImageFilter
W, H = 1080, 1920
rng = np.random.default_rng(7)

def blur_noise(scale, sigma):
    n = rng.random((H // scale + 2, W // scale + 2)).astype(np.float32)
    img = Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    img = img.filter(ImageFilter.GaussianBlur(sigma))
    return np.asarray(img, np.float32) / 255.0

base = np.array([226, 205, 165], np.float32)          # warm beige
blotch = blur_noise(60, 40) * 0.6 + blur_noise(20, 12) * 0.4
grain = rng.normal(0, 1, (H, W)).astype(np.float32)
fibers = blur_noise(3, 0.8)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vign = ((xx / W - .5) ** 2 * 1.4 + (yy / H - .5) ** 2) ** 1.0
shade = 1.0 - 0.18 * (blotch - .5) - 0.55 * vign - 0.025 * (fibers - .5)
img = base[None, None, :] * shade[..., None] + grain[..., None] * 3.0
# faint ruled lines like the notebook in the original photo
for y in range(170, H, 118):
    wob = (np.sin(xx[0] / 210.0 + y) * 1.2).astype(int)
    for x in range(W):
        yy0 = y + wob[x]
        img[yy0:yy0 + 2, x] *= 0.86
img = np.clip(img, 0, 255).astype(np.uint8)
Image.fromarray(img).save("paper.jpg", quality=92)
print("ok")
