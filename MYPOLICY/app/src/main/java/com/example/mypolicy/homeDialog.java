package com.example.mypolicy;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.View;

public class homeDialog extends Dialog {

    public homeDialog(Context context)
    {
        super(context);
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));  //다이얼로그의 배경을 투명으로 만듭니다.
        setContentView(R.layout.dialog_home);     //다이얼로그에서 사용할 레이아웃입니다.

    }



}
