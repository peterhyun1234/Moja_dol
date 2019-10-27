package com.example.firebase_20190925.adapter;

import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.firebase_20190925.R;

public class TestViewHolder extends RecyclerView.ViewHolder{
    public TextView _title;
    public TextView _edate;
    public TextView _sdate;
    public TextView _url;
    public TestViewHolder(View itemView) {
        super(itemView);


        _title = (TextView) itemView.findViewById(R.id.title);
        _edate = (TextView) itemView.findViewById(R.id.edate);
        _sdate = (TextView) itemView.findViewById(R.id.sdate);
        _url = (TextView) itemView.findViewById(R.id.url);
        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("포지션",""+getAdapterPosition());
            }
        });
        itemView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View view) {
                Log.d("롱포지션", ""+ getAdapterPosition());
                return false;
            }
        });
    }
}
