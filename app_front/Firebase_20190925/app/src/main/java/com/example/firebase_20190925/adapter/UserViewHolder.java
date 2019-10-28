package com.example.firebase_20190925.adapter;

import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.recyclerview.widget.RecyclerView;

import com.example.firebase_20190925.R;

public class UserViewHolder extends RecyclerView.ViewHolder {
    public ImageView mImageView;
    public TextView mUserName;
    public TextView mUserEmail;
    public TextView mUserPhone;

    public UserViewHolder(View itemView) {
        super(itemView);

        mImageView = (ImageView)itemView.findViewById(R.id.image_view);
        mUserName = (TextView) itemView.findViewById(R.id.user_name);
        mUserEmail = (TextView) itemView.findViewById(R.id.user_email);
        mUserPhone = (TextView) itemView.findViewById(R.id.user_phone);
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
