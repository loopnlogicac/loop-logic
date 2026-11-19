"""Recompute regression quiz panels and the five printable worksheet pictures."""
import argparse
import json
from pathlib import Path
import runpy
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import train_test_split
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]

def rent_validation():
    source = ROOT / "topics/regression/ml-regression-project/examples/ex-2.py"
    tools = runpy.run_path(str(source))
    frame = pd.read_csv(ROOT / "shared/datasets/rent.csv")
    xb, _, yb, _ = train_test_split(frame[tools["FEATURES"]], frame["rent_bdt"],
                                    test_size=0.2, random_state=0)
    xt, xv, yt, yv = train_test_split(xb, yb, test_size=0.25, random_state=0)
    rows = []
    for degree in [1, 2]:
        model = tools["make_model"](degree).fit(xt, yt)
        rows.append([degree, round(float(np.mean(abs(yv-model.predict(xv)))), 3)])
    return rows

def table(caption,bn,cols,rows):return dict(caption=dict(en=caption,bn=bn),panels=dict(tables=dict(data=dict(rows=len(rows),cols=len(cols),colLabels=cols,cells=rows))))
def chart(caption,bn,x,y,series):return dict(caption=dict(en=caption,bn=bn),panels=dict(chart=dict(xLabel=x,yLabel=y,series=[dict(id=f's{k}',label=label,type='line',points=points) for k,(label,points) in enumerate(series)])))
x=np.array([1.,2,3,4,5]);y=np.array([3.,4,5,4,9]);m=LinearRegression().fit(x[:,None],y);pred=m.predict(x[:,None]);res=y-pred
LINEFIG=table('Five measured targets and their least-squares predictions.','পাঁচটা আসল মান আর least-squares রেখার অনুমান।',['x','Observed','Predicted','Residual'],[[float(a),float(b),round(float(c),2),round(float(d),2)] for a,b,c,d in zip(x,y,pred,res)])
MEANFIG=table('Centred quantities for the same five observations.','একই পাঁচটা পয়েন্টে গড় থেকে ফাঁকের হিসাব।',['x - mean x','y - mean y','Product','x gap squared'],[[float(a-3),round(float(b-5),2),round(float((a-3)*(b-5)),2),float((a-3)**2)] for a,b in zip(x,y)])
slopes=np.arange(-10,41)/10
COSTFIG=chart('MSE for slopes with intercept fixed at 1.4.','intercept 1.4 রেখে ঢাল বদলালে MSE।','Slope','MSE',[('Cost',[[float(w),round(float(np.mean((y-w*x-1.4)**2)),3)] for w in slopes])])
RATEFIG=chart('Ten full-batch updates on y=2x+1, x=-2,-1,0,1,2.','পাঁচটা পয়েন্টে দশ ধাপ full-batch ট্রেনিং।','Update','MSE',[])
for lr in [.01,.1,.6]:
    xx=np.arange(-2,3);yy=2*xx+1;w=b=0.;values=[[0,float(np.mean(yy**2))]]
    for k in range(1,11):
        e=w*xx+b-yy;w,b=w-lr*2*np.mean(e*xx),b-lr*2*np.mean(e);values.append([k,float(np.mean((w*xx+b-yy)**2))])
    RATEFIG['panels']['chart']['series'].append(dict(id=f'lr{str(lr).replace(".","")}',label=f'lr={lr}',type='line',points=values))
px=np.linspace(-1,1,15);py=2+px-2*px**2+px**3+.3*np.cos(np.arange(15)*2);vx=np.linspace(-.95,.95,30);vy=2+vx-2*vx**2+vx**3
train=[];valid=[]
for d in range(1,13):
    A=np.vander(px,d+1,increasing=True);coef=np.linalg.lstsq(A,py,rcond=None)[0]
    train.append([d,float(np.mean((py-A@coef)**2))]);valid.append([d,float(np.mean((vy-np.vander(vx,d+1,increasing=True)@coef)**2))])
POLYFIG=chart('Training noise versus an untouched cubic validation rule.','ট্রেনিংয়ের শব্দ আর আলাদা cubic validation-এর ভুল।','Degree','MSE',[('Training',train),('Validation',valid)])
bestdegree=min(valid,key=lambda v:v[1])[0]
POLYFIG["panels"]["tables"] = {"validation": {
    "rows": 4, "cols": 2, "colLabels": ["Degree", "Validation MSE"],
    "cells": [[degree, round(valid[degree-1][1], 6)] for degree in [1, 3, 4, 12]]}}

raw=np.column_stack([px**j for j in range(1,9)]);Z=(raw-raw.mean(axis=0))/raw.std(axis=0);norms=[]
for alpha in [.1,.2,.5,1,2,5,10,20,50,100]:
    model=Ridge(alpha=alpha,solver='cholesky').fit(Z,py);norms.append([alpha,float(np.linalg.norm(model.coef_))])
RIDGEFIG=chart('Degree-eight ridge on standardised polynomial columns.','স্কেল করা ঘাতের কলামে degree-eight ridge-এর ওজন।','Alpha','Weight L2 norm',[('Weight norm',norms)])
METRICFIG=table('Target values and predictions in marks.','মার্কসের আসল মান আর অনুমান।',['Observed','Predicted','Residual'],[[a,b,a-b] for a,b in zip([2,4,6,8,10],[3,3,7,7,10])])
MULTIFIG=table('Predictions from 10 + 2 hours + 3 attendance flags.','10 + 2 hours + 3 attendance flag দিয়ে অনুমান।',['Hours','Attendance flag','Prediction'],[[h,a,10+2*h+3*a] for h,a in [(1,0),(2,1),(3,0),(4,1),(5,0),(6,1)]])
BASEFIG=table('The mean reference uses five targets 2,4,6,8,10.','পাঁচটা টার্গেট 2,4,6,8,10-এর গড় দিয়ে reference।',['Predictor','SSE','R2'],[['Perfect',0,1],['Evaluation mean',40,0],['Poor guesses',100,-1.5]])
PROJFIG=table('Validation MAE from the rent workflow, before development refitting.','development ডেটায় আবার শেখানোর আগে ভাড়ার validation MAE।',['Numeric degree','Validation MAE BDT'],rent_validation())

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview-dir", type=Path)
    args = parser.parse_args()
    if args.preview_dir:
        args.preview_dir.mkdir(parents=True, exist_ok=True)
    figures = dict(line=LINEFIG, means=MEANFIG, cost=COSTFIG, rates=RATEFIG,
                   polynomial=POLYFIG, ridge=RIDGEFIG, metrics=METRICFIG,
                   multiple=MULTIFIG, r2=BASEFIG, rent=PROJFIG)
    (ROOT / "shared/regression-figures.json").write_text(
        json.dumps(figures, ensure_ascii=False, indent=2) + "\n")
    worksheet = ROOT / "topics/regression/ml-regression-practice-sheet"
    assets = worksheet / "assets"
    assets.mkdir(exist_ok=True)
    plt.rcParams["svg.hashsalt"] = "regression-batch-five"
    for letter, key in zip("abcde", ["line", "cost", "rates", "polynomial", "ridge"]):
        figure = figures[key]
        if key == "polynomial":
            fig, (ax, tax) = plt.subplots(2, 1, figsize=(8, 5.2),
                                         gridspec_kw={"height_ratios": [3, 1]}, layout="constrained")
            grid = figure["panels"]["tables"]["validation"]
            tax.axis("off")
            tab = tax.table(cellText=grid["cells"], colLabels=grid["colLabels"], loc="center")
            tab.auto_set_font_size(False)
            tab.set_fontsize(10)
            tab.scale(1, 1.1)
        else:
            fig, ax = plt.subplots(figsize=(8, 4.4), layout="constrained")
        if key == "line":
            grid = figure["panels"]["tables"]["data"]
            ax.axis("off")
            tab = ax.table(cellText=grid["cells"], colLabels=grid["colLabels"], loc="center")
            tab.auto_set_font_size(False)
            tab.set_fontsize(12)
            tab.scale(1, 1.8)
        else:
            chart = figure["panels"]["chart"]
            for series in chart["series"]:
                values = np.asarray(series["points"])
                ax.plot(values[:, 0], values[:, 1], label=series["label"], marker=".", markersize=4)
            ax.set_xlabel(chart["xLabel"])
            ax.set_ylabel(chart["yLabel"])
            if key == "rates":
                ax.set_yscale("log")
                ax.set_ylabel("MSE (log scale)")
            ax.legend()
            ax.grid(alpha=0.2)
        ax.set_title(f"Picture {letter.upper()}: {key.replace('_', ' ')}")
        fig.savefig(assets / f"picture-{letter}.svg", metadata={"Date": None})
        if args.preview_dir:
            fig.savefig(args.preview_dir / f"picture-{letter}.png", dpi=100)
        plt.close(fig)
    print("Recomputed 10 regression panel figures and five worksheet SVGs.")


if __name__ == "__main__":
    main()
