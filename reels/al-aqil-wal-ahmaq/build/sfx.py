"""Foley + room ambience for the reel. No music, nothing tonal: every sound is
shaped noise (paper, pen, ink, stamp, book). Writes sfx.wav (44.1 kHz stereo)."""
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 44100
DUR = 69.31
rng = np.random.default_rng(42)
N = int(SR * DUR)
mix = np.zeros((N, 2), np.float64)


def bp(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)


def lp(x, f, order=4):
    return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)


def noise(d):
    return rng.standard_normal(int(SR * d))


def norm(x):
    m = np.max(np.abs(x)) or 1
    return x / m


def smooth(x, ms):
    k = max(1, int(SR * ms / 1000))
    return np.convolve(x, np.ones(k) / k, mode='same')


def fade(x, a=0.005, b=0.02):
    n = len(x); ia, ib = int(SR * a), int(SR * b)
    e = np.ones(n)
    if ia: e[:ia] = np.linspace(0, 1, ia)
    if ib: e[-ib:] = np.linspace(1, 0, ib)
    return x * e


# ---------------- sound generators ----------------
def pen_stroke(d, lo=2200, hi=7000):
    """single nib-on-paper stroke: grainy band noise with irregular pressure"""
    x = bp(noise(d), lo, hi)
    grain = smooth(np.abs(rng.standard_normal(len(x))) ** 2, 1.5)
    press = smooth(rng.uniform(.35, 1, len(x)), 25)
    t = np.linspace(0, 1, len(x))
    env = np.sin(np.pi * t) ** .6 * press * (0.6 + 0.8 * grain / grain.max())
    return norm(fade(x * env, .01, .03))


def writing(d, lo=1800, hi=6500):
    """continuous handwriting: series of strokes and tiny lifts"""
    out = np.zeros(int(SR * d)); pos = 0
    while pos < len(out) - SR * .06:
        sd = rng.uniform(.07, .28)
        s = pen_stroke(sd, lo, hi) * rng.uniform(.5, 1)
        e = min(len(out), pos + len(s)); out[pos:e] += s[:e - pos]
        pos = e + int(SR * rng.uniform(.015, .11))
    return norm(fade(out, .02, .08))


def marker(d):
    x = bp(noise(d), 700, 2800)
    t = np.linspace(0, 1, len(x))
    env = np.sin(np.pi * t) ** .5 * smooth(rng.uniform(.6, 1, len(x)), 40)
    return norm(fade(x * env, .02, .05))


def crinkles(d, density, lo=1500, hi=9000, curve=None):
    out = np.zeros(int(SR * d)); n = int(density * d)
    for _ in range(n):
        p = rng.random()
        if curve is not None and rng.random() > curve(p):
            continue
        L = rng.uniform(.004, .03)
        c = bp(noise(L + .01), lo, hi)[:int(SR * L)]
        c *= np.exp(-np.linspace(0, rng.uniform(3, 8), len(c))) * rng.uniform(.2, 1)
        i = int(p * (len(out) - len(c)))
        out[i:i + len(c)] += c
    return out


def rustle(d=.7):
    x = crinkles(d, 260, curve=lambda p: np.sin(np.pi * p) ** .7)
    body = bp(noise(d), 400, 2500) * .25 * np.sin(np.pi * np.linspace(0, 1, int(SR * d)))
    return norm(fade(x + body, .01, .1))


def flick():
    d = .16
    x = crinkles(d, 300, curve=lambda p: np.exp(-4 * p))
    x += bp(noise(d), 300, 1500) * np.exp(-np.linspace(0, 9, int(SR * d))) * .5
    return norm(fade(x, .002, .03))


def crumple(d=1.0):
    x = crinkles(d, 900, lo=900, hi=8000, curve=lambda p: .4 + .6 * np.sin(np.pi * p))
    x += bp(noise(d), 250, 1200) * .3 * np.sin(np.pi * np.linspace(0, 1, int(SR * d)))
    return norm(fade(x, .01, .15))


def air(d=.9, peak=.55):
    """soft whoosh: band-limited noise crossfading low->high->low"""
    n = int(SR * d); t = np.linspace(0, 1, n)
    lo_, hi_ = bp(noise(d), 150, 700), bp(noise(d), 700, 2600)
    w = np.clip(1 - np.abs(t - peak) / max(peak, 1 - peak), 0, 1)
    env = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.5)
    return norm(fade((lo_ * (1 - w) + hi_ * w * .8) * env, .01, .05))


def thud(decay=.12, cutoff=170, click=.25):
    d = decay * 5
    x = lp(noise(d), cutoff) * np.exp(-np.linspace(0, 5 * 5 * .12 / decay * decay / .12, int(SR * d)) )
    x = norm(x)
    c = hp(noise(.004), 2000) * np.linspace(1, 0, int(SR * .004)) * click
    x[:len(c)] += c
    return norm(fade(x, .0005, .05))


def ink_drop():
    x = thud(.16, 140, .05)
    wet = bp(noise(.35), 300, 1400) * np.exp(-np.linspace(0, 10, int(SR * .35))) * .25
    out = np.zeros(max(len(x), len(wet))); out[:len(x)] += x; out[:len(wet)] += wet
    return norm(out)


def stamp(light=False):
    x = thud(.09 if light else .12, 200, .6)
    knock = bp(noise(.12), 350, 1600) * np.exp(-np.linspace(0, 14, int(SR * .12)))
    out = np.zeros(len(x)); out[:len(knock)] += knock * (.8 if light else .6); out += x
    return norm(out)


def tap():
    x = bp(noise(.03), 1800, 6000) * np.exp(-np.linspace(0, 30, int(SR * .03)))
    y = lp(noise(.06), 400) * np.exp(-np.linspace(0, 20, int(SR * .06))) * .5
    out = np.zeros(len(y)); out[:len(x)] += x; out += y
    return norm(out)


def page_turn():
    a = air(.55, .45) * .6
    r = rustle(.6) * .8
    out = np.zeros(int(SR * .65)); out[:len(a)] += a; out[:len(r)] += r
    return norm(out)


def book_close():
    sw = air(.55, .7) * .7
    th = thud(.2, 120, .4)
    slap = bp(noise(.08), 900, 5000) * np.exp(-np.linspace(0, 12, int(SR * .08))) * .5
    out = np.zeros(int(SR * 1.6))
    out[:len(sw)] += sw
    i = int(SR * .55); out[i:i + len(th)] += th; out[i:i + len(slap)] += slap
    return norm(out)


# ---------------- placement ----------------
def place(t, x, db, pan=0.0):
    g = 10 ** (db / 20)
    i = int(t * SR); e = min(N, i + len(x)); x = x[:e - i] * g
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:e, 0] += x * l * 1.414
    mix[i:e, 1] += x * r * 1.414


EVENTS = [
    (0.00, rustle(.8), -24, -.2), (0.05, air(.7, .3), -28, 0),
    (4.55, pen_stroke(.42), -24, .1),
    (6.98, pen_stroke(.38), -25, -.1),
    (7.45, ink_drop(), -14, 0),
    (8.55, writing(2.6), -31, .15), (11.76, writing(3.15), -31, -.15),
    (24.90, marker(.45), -26, .2), (25.20, marker(.45), -26, -.2),
    (29.25, air(.85, .4), -27, 0), (29.60, pen_stroke(.7, 1500, 5000), -27, 0),
    (31.70, pen_stroke(.45), -24, -.1),
    (32.68, stamp(), -13, 0),
    (41.00, rustle(.6), -24, .2), (41.60, air(.9, .5), -29, 0),
    (46.95, air(1.6, .5), -27, 0),
    (47.90, pen_stroke(.7, 1500, 5000), -29, 0),
    (50.90, air(1.1, .4), -30, 0),
    (54.30, tap(), -26, 0),
    (55.68, crumple(1.0), -20, 0),
    (57.05, page_turn(), -22, -.2),
    (63.32, tap(), -22, 0), (64.70, tap(), -21, 0),
    (67.30, writing(1.05), -28, 0),
    (68.30, book_close(), -12, 0),
]
for i, (txt, t0, *_r) in enumerate([('', 34.44), ('', 34.8), ('', 35.12), ('', 35.45), ('', 36.0), ('', 36.5), ('', 36.96), ('', 37.4)]):
    EVENTS.append((t0, flick(), -25, (-1) ** i * .35))
    EVENTS.append((t0 + .05, pen_stroke(rng.uniform(.18, .3)), -31, (-1) ** i * .3))
for t0 in (38.6, 39.66, 40.46):
    EVENTS.append((t0, stamp(light=True), -18, 0))

for t, x, db, pan in EVENTS:
    place(t, x, db, pan)

# ---------------- room ambience ----------------
brown = np.cumsum(rng.standard_normal(N)); brown = hp(brown, 25); brown = lp(brown, 320)
hiss = bp(rng.standard_normal(N), 2000, 9000) * .06
amb = norm(brown) + hiss
amb = np.stack([amb, np.roll(amb, 997)], 1)
t = np.arange(N) / SR
gain = np.full(N, 10 ** (-46 / 20))
def ramp(a, b, g0, g1):
    m = (t >= a) & (t < b); gain[m] = 10 ** (np.interp(t[m], [a, b], [g0, g1]) / 20)
def hold(a, b, g):
    m = (t >= a) & (t < b); gain[m] = 10 ** (g / 20)
ramp(0, 1.5, -80, -46)
ramp(7.45, 7.7, -46, -54); hold(7.7, 8.5, -54); ramp(8.5, 9.2, -54, -46)
ramp(32.70, 32.78, -46, -120); hold(32.78, 33.55, -120); ramp(33.55, 33.9, -120, -46)   # total silence after "Fertig."
ramp(41.6, 42.0, -46, -52); hold(42.0, 46.4, -52); ramp(46.4, 47.0, -52, -46)
ramp(68.9, 69.31, -46, -100)
mix += amb * gain[:, None]

# hard mute the 0.75 s after the stamp tail so the silence is real
m = (t > 33.0) & (t < 33.55)
mix[m] *= 0.0

pcm = np.clip(mix, -1, 1)
with wave.open('sfx.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((pcm * 32767).astype('<i2').tobytes())
print('peak dBFS', 20 * np.log10(np.abs(mix).max()))
